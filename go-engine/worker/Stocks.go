package worker

import "opinion_trading_app/models"

func createSymbol(payload models.CreateSymbol) models.UserResponse {

	if _, ok := models.Orderbooks[payload.UserId]; !ok {
		return models.UserResponse{
			Success: false,
			Message: "This stocksymbol already exists",
			Data:    models.Orderbooks[payload.Stock],
		}
	}

	models.Orderbooks[payload.Stock] = models.Pricing{
		Yes: make(map[float64]models.Ordertype),
		No:  make(map[float64]models.Ordertype),
	}

	return models.UserResponse{
		Success: true,
		Message: "successfully created the stock",
		Data:    models.Orderbooks[payload.Stock],
	}

}

func Getorderbooks(payload string) models.UserResponse {
	orderbooks := models.Orderbooks
	if len(orderbooks) == 0 {
		return models.UserResponse{
			Success: false,
			Message: "No orderbooks available",
			Data:    nil,
		}

	} else {
		return models.UserResponse{
			Success: true,
			Message: "following orerbooks are available",
			Data:    orderbooks,
		}
	}

}

func ViewOrderbook(payload string) models.UserResponse {
	if payload == "" {
		return models.UserResponse{
			Success: false,
			Message: "Credentials are not enough",
			Data:    models.Orderbooks[payload],
		}
	}

	if orderbook, exists := models.Orderbooks[payload]; !exists {
		return models.UserResponse{
			Success: false,
			Message: "No orderbook found for the given symbol",

			Data: nil,
		}
	} else {
		return models.UserResponse{
			Data:    orderbook,
			Message: "Given is the orderbook",
			Success: true,
		}
	}

}

func getStocks(payload string) models.UserResponse {
	stocks := models.STOCK_BALANCES

	if len(stocks) == 0 {
		return models.UserResponse{
			Success: false,
			Message: "no stocks are available",
			Data:    nil,
		}
	} else {
		return models.UserResponse{
			Success: true,
			Data:    nil,
			Message: "These are the stocks",
		}
	}

}

func getUserStock(payload string) models.UserResponse {

	if orderbook, ok := models.Orderbooks[payload]; !ok {
		return models.UserResponse{
			Message: "no such orderbook available",
			Data:    nil,
			Success: false,
		}
	}
}
