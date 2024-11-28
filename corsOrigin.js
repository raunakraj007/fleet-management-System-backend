export const corsOptions = {
    origin: (origin, callback) => {
        console.log(`Origin: ${origin}`);
      const allowedOrigins = ['http://localhost:5173']; // List of allowed origins
      if (allowedOrigins.includes(origin) || origin === undefined) {
        callback(null, origin); // Allow the request
        console.log('CORS allowed');
      } else {
        console.log("origin: ",origin);
        callback(new Error('Not allowed by CORS')); // Reject the request
        console.log('CORS blocked');
      }
    },
    credentials: true, // Allow cookies or credentials
  };