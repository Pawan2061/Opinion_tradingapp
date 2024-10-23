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

var INR_BALANCES = UserWithBalance{}
