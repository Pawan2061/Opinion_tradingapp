package models

type Orders struct {
	Quantity int
	Type     string
}

type Ordertype struct {
	Total  int
	Orders map[string]Orders
}

type Pricing struct {
	Yes map[int]Ordertype
	No  map[int]Ordertype
}

type Orderbook map[string]Pricing

var Orderbooks = Orderbook{}
