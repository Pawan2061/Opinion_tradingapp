package models

type UserBalance struct {
	Balance int
	Locked  int
}

type UserWithBalance map[string]UserBalance
type OnrampedUser struct {
	userId string
	amount int
}

type Outcome struct {
	Quantity int
	Locked   int
}

type Stocksymbol map[string]Outcome
type User map[string]Stocksymbol

type Stock map[string]User

var STOCK_BALANCES = Stock{}

var INR_BALANCES = UserWithBalance{}
