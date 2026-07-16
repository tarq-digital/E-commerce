# User Flows - Weebster

This document maps out the specific, step-by-step logic gates a user encounters during critical application processes.

---

## 1. Authentication Flow (Login / Register)

```mermaid
flowchart TD
    Start[User clicks Login] --> HasAccount{Has Account?}
    HasAccount -- Yes --> LoginForm[Enter Email & Password]
    HasAccount -- No --> RegisterForm[Enter Details & Password]
    
    RegisterForm --> ValidateReg{Valid?}
    ValidateReg -- No --> ShowRegError[Show inline errors]
    ValidateReg -- Yes --> API_Reg[POST /register]
    API_Reg --> APISuccess{Success?}
    APISuccess -- No --> ShowAPIError[Show Toast: Email exists]
    APISuccess -- Yes --> LoginRoute[Route to Login]

    LoginForm --> ValidateLog{Valid?}
    ValidateLog -- No --> ShowLogError[Show inline errors]
    ValidateLog -- Yes --> API_Log[POST /login]
    
    API_Log --> ValidCreds{Credentials Match?}
    ValidCreds -- No --> ShowCredError[Toast: Invalid Credentials]
    ValidCreds -- Yes --> SetTokens[Set HttpOnly Cookie & Memory Token]
    SetTokens --> Redirect{Has Redirect URL?}
    Redirect -- Yes --> RedirectTarget[Redirect to /checkout etc.]
    Redirect -- No --> RedirectDash[Redirect to /dashboard]
```

## 2. Admin Product Creation Flow

```mermaid
flowchart TD
    Start[Admin clicks 'New Product'] --> Form[Fill Product Details]
    Form --> UploadImage[Upload Image to Cloudinary]
    UploadImage --> ImageSuccess{Success?}
    ImageSuccess -- No --> ShowImgError[Toast: Upload Failed]
    ImageSuccess -- Yes --> AttachURL[Attach URL to payload]
    
    AttachURL --> Submit[Submit Form]
    Submit --> Validate{Client Valid?}
    Validate -- No --> ShowErr[Highlight missing fields]
    Validate -- Yes --> API[POST /admin/products]
    
    API --> APISuccess{DB Saved?}
    APISuccess -- No --> ShowAPIError[Toast: Server Error]
    APISuccess -- Yes --> Redirect[Redirect to Product List]
    Redirect --> Toast[Toast: Product Created]
```

## 3. Cart Interaction Flow

```mermaid
flowchart TD
    Start[User clicks 'Add to Cart'] --> CheckAuth{Is Logged In?}
    
    CheckAuth -- Yes --> API_Add[POST /cart API]
    API_Add --> UpdateContext[Update React Context]
    
    CheckAuth -- No --> LocalStore[Save to localStorage]
    LocalStore --> UpdateContext
    
    UpdateContext --> OpenDrawer[Slide open Cart Drawer]
    OpenDrawer --> Decision{User Action}
    
    Decision -- Clicks +/- --> UpdateQty[Update Quantity]
    UpdateQty --> CheckStock{Stock Available?}
    CheckStock -- No --> ShowMax[Toast: Max stock reached]
    CheckStock -- Yes --> Calc[Recalculate Subtotal]
    
    Decision -- Clicks Checkout --> Route[Route to /checkout]
```

## 4. Wishlist Flow

```mermaid
flowchart TD
    Start[User clicks Heart Icon] --> CheckAuth{Is Logged In?}
    CheckAuth -- No --> ShowModal[Modal: Please Login]
    CheckAuth -- Yes --> CheckState{Already Wishlisted?}
    
    CheckState -- Yes --> API_Remove[DELETE /wishlist/:id]
    API_Remove --> UpdateUI_Empty[Change Heart to Empty]
    
    CheckState -- No --> API_Add[POST /wishlist/:id]
    API_Add --> UpdateUI_Filled[Change Heart to Filled Solid]
```
