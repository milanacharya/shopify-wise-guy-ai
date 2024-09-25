import { useEffect, useState } from 'react';
import { Container, Row, Form, Button, Table } from 'react-bootstrap';

function App() {
  // Holds the prompt entered in the textarea
  const [prompt, setPrompt] = useState('');
  // Holds the responses received from the AI engine. Initialized using the value present in the local storage
  const [responses, setResponses] = useState(localStorage.getItem('response') ? JSON.parse(localStorage.getItem('response')) : []);
  // Holds the AI engine to use
  const [engine, setEngine] = useState('text-curie-001');

  // Store the value in local storage as the responses are updated
  useEffect(() => {
    localStorage.setItem('response', JSON.stringify(responses));
  }, [responses]);

  // Handle the form submit
  const handleSubmit = event => {
    event.preventDefault();

    // Parameters for the POST request
    const params = {
      prompt: prompt,
      max_tokens: 64
    };

    // Send the request
    fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
      },
      body: JSON.stringify(params),
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      // Append response at the front of the JSON object array
      setResponses([{ prompt: prompt, response: jsonResponse.choices[0].text, id:jsonResponse.id }, ...responses]);
    }).catch(error => {
      console.log(error);
    });
  }

  return (
    <div className="App">
      <Container>
        <br />
        <Row>
          <h1>Wise Guy - AI</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control as="textarea" placeholder="Enter a prompt. For example: 'Who is Chuck Norris?'" onChange={(e) => setPrompt(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>AI Engine</Form.Label>
              <Form.Select onChange={(e) => setEngine(e.target.value)}>
                <option value="text-curie-001">Curie (Default)</option>
                <option value="text-davinci-002">Da Vinci</option>
                <option value="text-babbage-001">Babbage</option>
                <option value="text-ada-001">Ada</option>
              </Form.Select>
            </Form.Group>

            <Button variant="dark" type="submit">
              Submit
            </Button>
          </Form>
        </Row>
        <br />
        <Row>
          <h2>Responses</h2>
          {(responses.length < 1) ?
            <p>There are no responses yet.</p>
            :
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Prompt</th>
                  <th>Response</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response) => (
                  <tr key={response['id']}>
                    <td>{response['prompt']}</td>
                    <td>{response['response']}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          }
        </Row>
      </Container>
    </div>
  );
}

export default App;
