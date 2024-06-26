const axios = require('axios');

const options = {
  method: 'POST',
  url: 'https://api.pawan.krd/v1/chat/completions',
  headers: {
    'Authorization': 'Bearer pk-kTeyJxwRVoXXXRBdnvKQiyNGLtAqosrfWROTDmLURpdjSzCw',
    'Content-Type': 'application/json'
  },
  data: {
    model: 'pai-001-light',
    max_tokens: 100,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: 'Who are you?'
      }
    ]
  }
};

axios.request(options)
  .then(response => {
    console.log(response.data.choices[0].content);
  })
  .catch(error => {
    console.error(error);
  });
