// src/features/auth/callback.template.ts
export default `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet">
  <title>Authentication Successful</title>
  <style>
    :root {
      --chakra-colors-teal-500: #2C7A7B;
      --chakra-colors-gray-700: #2D3748;
      --chakra-fontSizes-xl: 1.25rem;
      --chakra-fontWeights-bold: 700;
      --chakra-space-4: 1rem;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Open Sans', sans-serif;
      background-color: #f7fafc;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .container {
      max-width: 640px;
      padding: var(--chakra-space-4);
      text-align: center;
      color: var(--chakra-colors-gray-700);
    }

    h2 {
      font-size: var(--chakra-fontSizes-xl);
      font-weight: var(--chakra-fontWeights-bold);
      margin-bottom: var(--chakra-space-4);
    }

    p {
      font-size: 1rem;
      line-height: 1.5;
    }

    .success-text {
      color: var(--chakra-colors-teal-500);
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 class="success-text">Authentication Successful!</h2>
    <p>You have been successfully authenticated. You can now return to the application.</p>
  </div>
</body>
</html>
` as const;
