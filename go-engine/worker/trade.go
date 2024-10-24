package worker

import (
	"opinion_trading_app/models"
)

func SellYes(payload models.YesPayload) models.UserResponse {
	userStock, ok := models.STOCK_BALANCES[payload.UserId]
	if !ok {
		return models.UserResponse{
			Success: false,
			Message: "No stocks available",
			Data:    nil,
		}
	}

	stockSymbol, ok := userStock[payload.Stocksymbol]
	if !ok {
		return models.UserResponse{
			Success: false,
			Message: "No stock available for this stocksymbol",
		}
	}

	outcome, ok := stockSymbol["yes"]
	if !ok {
		return models.UserResponse{
			Success: false,
			Message: "No stock available",
		}
	}

	if outcome.Quantity < payload.Quantity {
		return models.UserResponse{
			Success: false,
			Message: "User doesn't have enough stocks",
			Data:    nil,
		}
	}

	outcome.Locked += payload.Quantity
	outcome.Quantity -= payload.Quantity

	stockSymbol["yes"] = outcome

	newOrderbook, ok := models.Orderbooks[payload.Stocksymbol]
	if !ok {
		newOrderbook = models.Pricing{
			Yes: make(map[int]models.Ordertype),
			No:  make(map[int]models.Ordertype),
		}
		models.Orderbooks[payload.Stocksymbol] = newOrderbook
	}

	orderbook, ok := models.Orderbooks[payload.Stocksymbol].Yes[int(payload.Price)]
	if !ok {
		orderbook = models.Ordertype{
			Total:  0,
			Orders: make(map[string]models.Orders),
		}
		models.Orderbooks[payload.Stocksymbol].Yes[int(payload.Price)] = orderbook
	}

	lastBook, ok := models.Orderbooks[payload.Stocksymbol].Yes[int(payload.Price)].Orders[payload.UserId]
	if !ok {
		lastBook = models.Orders{
			Quantity: 0,
			Type:     "normal",
		}
		models.Orderbooks[payload.Stocksymbol].Yes[int(payload.Price)].Orders[payload.UserId] = lastBook
	}

	latestOrderbook := models.Orderbooks[payload.Stocksymbol].Yes[int(payload.Price)]
	latestOrderbook.Total += payload.Quantity

	lastBook.Quantity += payload.Quantity

	latestOrderbook.Orders[payload.UserId] = lastBook

	return models.UserResponse{
		Success: true,
		Message: "Stock sold successfully",
		Data:    models.Orderbooks[payload.Stocksymbol],
	}
}

func Sellno(payload models.NoPayload) models.UserResponse {
	userStock, ok := models.STOCK_BALANCES[payload.UserId]
	if !ok {
		return models.UserResponse{
			Success: false,
			Message: "No stocks available",
			Data:    nil,
		}
	}

	stockSymbol, ok := userStock[payload.Stocksymbol]
	if !ok {
		return models.UserResponse{
			Success: false,
			Message: "No stock available for this stocksymbol",
			Data:    nil,
		}
	}

	outcome, ok := stockSymbol["no"]
	if !ok {
		return models.UserResponse{
			Success: false,
			Message: "No stock available",
			Data:    nil,
		}
	}

	if outcome.Quantity < payload.Quantity {
		return models.UserResponse{
			Success: false,
			Message: "User doesn't have enough stocks",
			Data:    nil,
		}
	}

	outcome.Locked += payload.Quantity
	outcome.Quantity += payload.Quantity
	stockSymbol["no"] = outcome

	newOrderbook, ok := models.Orderbooks[payload.Stocksymbol]
	if !ok {
		newOrderbook = models.Pricing{
			Yes: make(map[int]models.Ordertype),
			No:  make(map[int]models.Ordertype),
		}
		models.Orderbooks[payload.Stocksymbol] = newOrderbook
	}

	orderbook, ok := models.Orderbooks[payload.Stocksymbol].No[int(payload.Price)]
	if !ok {
		orderbook = models.Ordertype{
			Total:  0,
			Orders: make(map[string]models.Orders),
		}
		models.Orderbooks[payload.Stocksymbol].Yes[int(payload.Price)] = orderbook
	}

	lastbook, ok := models.Orderbooks[payload.Stocksymbol].No[int(payload.Price)].Orders[payload.UserId]
	if !ok {
		lastbook = models.Orders{
			Quantity: 0,
			Type:     "normal",
		}
		models.Orderbooks[payload.Stocksymbol].No[int(payload.Price)].Orders[payload.UserId] = lastbook

	}

	latestOrderBook := models.Orderbooks[payload.Stocksymbol].Yes[int(payload.Price)]
	latestOrderBook.Total += payload.Quantity
	lastbook.Quantity += payload.Quantity
	latestOrderBook.Orders[payload.UserId] = lastbook
	return models.UserResponse{
		Success: true,
		Message: "Stock sold successfully",
		Data:    models.Orderbooks[payload.Stocksymbol],
	}

}

func BuyYes(payload models.BuyYes) models.UserResponse {
	if payload.Stocksymbol == "" || payload.Price <= 0 ||
		payload.UserId == "" || payload.Quantity <= 0 ||
		payload.StockType == "" {

		return models.UserResponse{
			Success: false,
			Message: "Invalid request: All fields must be provided with valid values",
			Data:    nil,
		}
	}
	user := models.INR_BALANCES[payload.UserId]
	if user.Balance < payload.Price*payload.Quantity {
		return models.UserResponse{
			Success: false,
			Message: "insuffficient balance of user",
			Data:    map[string]interface{}{},
		}
	}
	_, exists := models.Orderbooks[payload.Stocksymbol]

	if !exists {
		models.Orderbooks[payload.Stocksymbol] = models.Pricing{
			Yes: make(map[int]models.Ordertype),
			No:  make(map[int]models.Ordertype),
		}
	}

	if models.Orderbooks[payload.Stocksymbol].Yes == nil {
		models.Orderbooks[payload.Stocksymbol] = models.Pricing{
			Yes: make(map[int]models.Ordertype),
		}

	}

	_, priceExists := models.Orderbooks[payload.Stocksymbol].Yes[payload.Price]
	newPrice := 1000 - payload.Price
	if !priceExists {

		if _, noPriceExists := models.Orderbooks[payload.Stocksymbol].No[payload.Price]; !noPriceExists {
			models.Orderbooks[payload.Stocksymbol].No[newPrice] = models.Ordertype{
				Total:  0,
				Orders: make(map[string]models.Orders),
			}

		}

		newOrder, orderExists := models.Orderbooks[payload.Stocksymbol].No[newPrice].Orders[payload.UserId]
		if orderExists {
			newOrder.Quantity += payload.Quantity
			newOrder.Type = "inverse"

			existingOrder := models.Orderbooks[payload.Stocksymbol].No[newPrice]
			existingOrder.Total += payload.Quantity
			user.Locked += payload.Price * payload.Quantity
			user.Balance -= payload.Price * payload.Quantity
			return models.UserResponse{
				Success: true,
				Message: "Orderbook updated",
				Data:    newOrder,
			}

		} else {
			newBook := models.Orderbooks[payload.Stocksymbol].No[newPrice].Orders[payload.UserId]
			newBook.Quantity += payload.Quantity
			newBook.Type = "inverse"

			copiedBook := models.Orderbooks[payload.Stocksymbol].No[newPrice]
			copiedBook.Total += payload.Quantity
			user.Locked += payload.Price * payload.Quantity
			user.Balance -= payload.Price * payload.Quantity

			return models.UserResponse{
				Success: true,
				Message: "Orderbook",
				Data:    models.Orderbooks[payload.Stocksymbol],
			}

		}

	}
	if orders, ok := models.Orderbooks[payload.Stocksymbol].Yes[payload.Price]; ok {
		totalAmount := payload.Quantity
		for userId, order := range orders.Orders {
			if totalAmount <= 0 {
				break
			}
			currentQuantity := order.Quantity
			subtraction := min(totalAmount, currentQuantity)
			existingUser := models.INR_BALANCES[userId]
			existingUser.Balance += payload.Price * subtraction

			models.INR_BALANCES[userId] = existingUser

			newUser := models.Orderbooks[payload.Stocksymbol].Yes[payload.Price].Orders[userId]
			newUser.Quantity -= subtraction
			totalAmount -= subtraction
			if _, exists := models.STOCK_BALANCES[payload.UserId]; !exists {
				models.STOCK_BALANCES[payload.UserId] = make(map[string]models.Stocksymbol)

			}
			if stock, exists := models.STOCK_BALANCES[payload.UserId][payload.Stocksymbol]; !exists {
				// models.STOCK_BALANCES[payload.UserId][payload.Stocksymbol]
				stock[payload.Stocksymbol] = models.Outcome{
					Quantity: 0,
					Locked:   0,
				}
			}
			existingStock := models.STOCK_BALANCES[payload.UserId][payload.Stocksymbol]["yes"]
			existingStock.Quantity -= subtraction

		}

		orderbook := models.Orderbooks[payload.Stocksymbol].Yes[payload.Price]
		orderbook.Total -= payload.Quantity - totalAmount
		if orderbook.Total == 0 {
			delete(models.Orderbooks[payload.Stocksymbol].Yes, payload.Price)
		}
		user.Balance -= payload.Price * payload.Quantity

	} else {
		user.Balance -= payload.Price * payload.Quantity
		user.Locked += payload.Price * payload.Quantity
		models.INR_BALANCES[payload.UserId] = user
	}

	// return the displaybook here
	return models.UserResponse{
		Success: true,
		Message: "Orderbook",
		Data:    models.Orderbooks[payload.Stocksymbol],
	}

}
func BuyNo() {}
