package worker

import "opinion_trading_app/models"

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
