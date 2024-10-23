package worker

import (
	"opinion_trading_app/models"
)

func CreateUser(userId string) models.UserResponse {
	users := make(models.UserWithBalance)

	if _, ok := users[userId]; ok {
		return models.UserResponse{
			Success: false,
			Message: "user already exists",
			Data:    nil,
		}

	}
	users[userId] = models.UserBalance{
		Balance: 0,
		Locked:  0,
	}

	return models.UserResponse{
		Success: true,
		Message: "user created successfully",
		Data:    users[userId],
	}

}

func OnrampUser(payload models.Onramp) models.UserResponse {
	users := make(models.UserWithBalance)

	if payload.Amount <= 0 || payload.UserId == "" {
		return models.UserResponse{
			Success: false,
			Message: "Insufficicent credentials",
			Data:    nil,
		}
	}
	if userBalance, ok := users[payload.UserId]; ok {
		userBalance.Balance += payload.Amount
		userBalance.Locked += 0
		users[payload.UserId] = userBalance

		return models.UserResponse{
			Success: true,
			Message: "user balance updated successfully",
			Data:    userBalance,
		}

	} else {
		users[payload.UserId] = models.UserBalance{
			Balance: payload.Amount,
			Locked:  0,
		}

		return models.UserResponse{
			Success: true,
			Message: "new user made and updated",
			Data:    users[payload.UserId],
		}
	}

}
func GetBalances(payload string) models.UserResponse {

	if len(models.INR_BALANCES) == 0 {
		return models.UserResponse{
			Success: false,
			Message: "Didnt get any balance",
			Data:    nil,
		}

	}

	return models.UserResponse{
		Success: true,
		Message: "these are the balances",
		Data:    models.INR_BALANCES,
	}

}

func GetUserBalance(payload string) models.UserResponse {
	if user, exists := models.INR_BALANCES[payload]; !exists {
		return models.UserResponse{
			Success: false,
			Message: "This is the user with following balance",
			Data:    nil,
		}

	} else {
		return models.UserResponse{
			Success: true,
			Message: "This is the user data",
			Data:    user,
		}
	}
}
