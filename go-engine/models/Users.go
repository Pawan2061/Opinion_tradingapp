package models

type UserResponse struct {
	Message string

	Success bool
	Data    any
}
