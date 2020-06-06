import React, { useState } from 'react';
import './App.css';

const re = /\S+@\S+\.\S+/;

function App() {
  const [recipient, setRecipient] = useState('');
  const [recipientError, setRecipientError] = useState(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [buttonText, setButtonText] = useState('Generate Link');
  const [generatedMailto, setGeneratedMailto] = useState('');

  const generateLink = () => {
    if (recipient === '' || subject === '') {
      setButtonText('Please enter text in blank fields');
    } else if (recipientError) {
      setButtonText('Please enter a valid email format');
    } else {
      let mailtoLink = 'mailto:';
      mailtoLink += recipient + '&subject=' + subject.split(' ').join('%20');
      let bodyStr = JSON.stringify(body);
      bodyStr = bodyStr.split("\"").join("");
      bodyStr = bodyStr.split("\\n").join("%0A");
      mailtoLink += '&body=' + bodyStr;
  
      setGeneratedMailto(mailtoLink);
    }
  };

  const handleEmailInput = e => {
    setRecipient(e.target.value);
    
    if (re.test(e.target.value)) {
      setButtonText('Generate Link');
      setRecipientError(false);
    } else {
      setRecipientError(true);
    }
  };

  return (
    <div className="app-container">
      <div className="title">
        <div style={{ display: 'inline-block'}} className="logo">
          <div style={{ display: 'flex'}}>
            <div style={{ height: '10px', width: '10px', backgroundColor: '#063940'}} />
            <div style={{ height: '10px', width: '10px', backgroundColor: '#195E63'}} />
          </div>
          <div style={{ display: 'flex'}}>
            <div style={{ height: '10px', width: '10px', backgroundColor: '#3E838C'}} />
            <div style={{ height: '10px', width: '10px', backgroundColor: '#8EBDB6'}} />
          </div>
        </div>
        <span style={{ marginLeft: '12px' }}>MAIL-TO</span>
      </div>
      <div className="email-header">
        <div className="email-header-line">
          <label>To: </label>
          <input 
            type="text" 
            style= {{ color: recipientError ? '#ff0000b3' : '#000000' }}
            value={recipient} 
            onChange={handleEmailInput} />
        </div>
        <div className="email-header-line">
          <label>Subject: </label>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
      </div>
      <div className="email-body">
        <label>Body: </label>
        <textarea value={body} onChange={e => setBody(e.target.value)} />
        <input style={{ visibility: 'visible' }} type="text" defaultValue={generatedMailto} />
        <button onClick={() => generateLink()}>{buttonText}</button>
      </div>
    </div>
  );
}

export default App;
