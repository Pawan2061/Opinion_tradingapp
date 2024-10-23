package models

type Outcome struct {
	Quantity int
	Locked   int
}

type Stocksymbol map[string]Outcome
type User map[string]Stocksymbol

type Stock map[string]User

var STOCK_BALANCES = Stock{}
