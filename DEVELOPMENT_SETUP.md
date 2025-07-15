# Development Setup Guide

## Backend API Setup

### 1. Start Your Backend Server
Your .NET backend is running on `https://localhost:7197` (HTTPS).

```bash
# In your backend project directory
dotnet run
```

### 2. Configure CORS in Your Backend
Add CORS configuration to your `Program.cs` or `Startup.cs`:

```csharp
// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:8080", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// In the middleware section
app.UseCors("AllowFrontend");
```

### 3. Environment Configuration
Create a `.env` file in your frontend project root:

```env
VITE_API_URL=https://localhost:7197
```

## Frontend Development

### 1. Start the Frontend
```bash
npm run dev
# or
yarn dev
```

### 2. Verify Configuration
Check that the API URL is correctly set in the browser console:
- Open Developer Tools (F12)
- Check the console for API request logs
- Verify the URL is `https://localhost:7197`

### 3. Troubleshooting

#### Connection Refused Error
- Ensure your backend server is running
- Check the port number (7197)
- Verify the protocol (https vs http)

#### CORS Errors
- Add CORS configuration to your backend
- Ensure the frontend origin is allowed
- Check that credentials are properly configured

#### SSL Certificate Errors
- For local development, you may need to accept the self-signed certificate
- In Chrome, type `thisisunsafe` when you see the security warning
- Or navigate to `https://localhost:7197` and accept the certificate

## Testing the Connection

1. Start both frontend and backend servers
2. Try to log in with test credentials
3. Check the browser's Network tab for successful API calls
4. Verify that authentication tokens are being stored

## Common Issues and Solutions

### Issue: "Failed to fetch" error
**Solution**: Backend server is not running or not accessible
- Start your backend server
- Check the port number
- Verify the API URL configuration

### Issue: CORS policy errors
**Solution**: Configure CORS in your backend
- Add CORS middleware
- Allow your frontend origin
- Enable credentials if needed

### Issue: SSL certificate errors
**Solution**: Accept the self-signed certificate
- Navigate to `https://localhost:7197` in your browser
- Click "Advanced" and "Proceed to localhost"
- Or type `thisisunsafe` in Chrome when you see the warning 