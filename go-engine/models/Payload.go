package models

type Onramp struct {
	UserId string
	Amount int
}

type CreateSymbol struct {
	UserId string
	Stock  string
}

type YesPayload struct {
	Stocksymbol string
	Price       float64
	Quantity    int
	UserId      string
	StockType   string
}

type NoPayload struct {
	Stocksymbol string
	Price       float64
	Quantity    int
	UserId      string
	StockType   string
}
