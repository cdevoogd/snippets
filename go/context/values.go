package main

import (
	"context"
	"fmt"
)

func main() {
	// Even though this is just a small example, I think that it is good to get in the habit of
	// making sure your contexts are cancelled.
	baseCtx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// The context is brand new, so if we try to query the user ID we should see that it is missing
	userID, ok := GetUserID(baseCtx)
	fmt.Println("Querying the base context BEFORE adding the ID")
	fmt.Printf("    UserID: %s, OK: %v\n", userID, ok)

	// Now we create a child context that does have a user ID attached
	childCtx := WithUserID(baseCtx, "foo")

	// If we query the new context, we should get the ID back
	userID, ok = GetUserID(childCtx)
	fmt.Println("Querying the child context with the ID attached")
	fmt.Printf("    UserID: %s, OK: %v\n", userID, ok)

	// Note that WithUserID created a new child context with the ID. It did not affect the parent
	// context. If we try to query the parent context again, we will see that it still does not have
	// the ID.
	userID, ok = GetUserID(baseCtx)
	fmt.Println("Querying the base context AFTER adding the ID")
	fmt.Printf("    UserID: %s, OK: %v\n", userID, ok)
}

// When adding values to a context, always define your own type to use as the key. Defining your own
// custom type prevents collisions with context keys that are defined in other packages.
type privateContextKey int

// The actual value of the key is not really important, as long as it is unique to the other keys
// used in your package.
const userIDKey privateContextKey = 0

// WithUserID will create a new context with the userID value attached to it. Note that functions
// to add values to context tend to use *With* instead of *Set* because a context is immutable. This
// will actually create a new child context with the value instead of modifying the initial context.
func WithUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, userIDKey, userID)
}

// GetUserID will return the user ID from the context if it exists. A boolean will be returned to
// signal if the value was found and the proper type.
func GetUserID(ctx context.Context) (userID string, ok bool) {
	val := ctx.Value(userIDKey)

	userID, ok = val.(string)
	return userID, ok
}
