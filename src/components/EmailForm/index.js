import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { db } from '../../firebase.js';
import './index.css';

const re = /\S+@\S+\.\S+/;
const bodyText =
  'Enter a recipient and cc/bcc if applicable. ' +
  'For multiple recipients, add a comma between emails. ' +
  '\nWrite an email template and generate a link to share!';

function EmailForm() {
  const [recipient, setRecipient] = useState('');
  const [recipientError, setRecipientError] = useState(null);
  const [cc, setCc] = useState('');
  const [ccError, setCcError] = useState('');
  const [isCcEnabled, setIsCcEnabled] = useState(false);
  const [bcc, setBcc] = useState('');
  const [bccError, setBccError] = useState('');
  const [isBccEnabled, setIsBccEnabled] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [buttonText, setButtonText] = useState('Generate link');
  const [generatedMailto, setGeneratedMailto] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copyText, setCopyText] = useState('Click to copy');

  const saveLink = async (mailto) => {
    const mailtoID = await db.collection('links').add({ mailto });
    setGeneratedMailto(window.location.href + mailtoID.id);
  };

  const generateLink = async () => {
    if (recipient === '' || subject === '' || body === '') {
      setButtonText('Please enter text in blank fields');
    } else if (recipientError || ccError || bccError) {
      setButtonText('Please enter a valid email format');
    } else {
      let mailtoLink = 'mailto:' + recipient;

      // Add cc and bcc if selected
      if (isCcEnabled && isBccEnabled) {
        // If Cc and Bcc included
        mailtoLink += '?cc=' + cc + '&bcc=' + bcc + '&subject=' + subject.split(' ').join('%20');
      } else if (isCcEnabled) {
        // If Cc included
        mailtoLink += '?cc=' + cc + '&subject=' + subject.split(' ').join('%20');
      } else if (isBccEnabled) {
        // If Bcc included
        mailtoLink += '?bcc=' + bcc + '&subject=' + subject.split(' ').join('%20');
      } else {
        // Only subject and body
        mailtoLink += '?subject=' + subject.split(' ').join('%20');
      }

      // Transform and add body
      mailtoLink = mailtoLink.replace(/\s+/g, '');
      let bodyStr = JSON.stringify(body);
      bodyStr = bodyStr.split('"').join('');
      bodyStr = bodyStr.split('\\n').join('%0A');
      mailtoLink += '&body=' + bodyStr;

      setGeneratedMailto('Generating...');
      setIsSubmitted(true);
      setButtonText('Clear');

      await saveLink(mailtoLink);
    }
  };

  const handleGenerateClick = async () => {
    if (isSubmitted) {
      setRecipient('');
      setSubject('');
      setBody('');
      setIsSubmitted(false);
      setGeneratedMailto('');
      setButtonText('Generate link');
      setCopyText('Click to copy');
    } else {
      await generateLink();
    }
  };

  const handleEmailInput = (e) => {
    const recipientInput = e.target.value;
    setRecipient(recipientInput);

    if (recipientInput.includes(',')) {
      recipientInput.split(',').forEach((input) => {
        if (re.test(input)) {
          setButtonText('Generate Link');
          setRecipientError(false);
        } else {
          setRecipientError(true);
        }
      });
    } else {
      if (re.test(recipientInput)) {
        setButtonText('Generate Link');
        setRecipientError(false);
      } else {
        setRecipientError(true);
      }
    }
  };

  const handleCcInput = (e) => {
    const ccInput = e.target.value;
    setCc(ccInput);

    if (ccInput.includes(',')) {
      ccInput.split(',').forEach((input) => {
        if (re.test(input)) {
          setButtonText('Generate Link');
          setCcError(false);
        } else {
          setCcError(true);
        }
      });
    } else {
      if (re.test(ccInput)) {
        setButtonText('Generate Link');
        setCcError(false);
      } else {
        setCcError(true);
      }
    }
  };

  const handleBccInput = (e) => {
    const bccInput = e.target.value;
    setBcc(bccInput);

    if (bccInput.includes(',')) {
      bccInput.split(',').forEach((input) => {
        if (re.test(input)) {
          setButtonText('Generate Link');
          setBccError(false);
        } else {
          setBccError(true);
        }
      });
    } else {
      if (re.test(bccInput)) {
        setButtonText('Generate Link');
        setBccError(false);
      } else {
        setBccError(true);
      }
    }
  };

  const handleCopy = () => {
    setCopyText('Copied!');
    setTimeout(() => {
      setCopyText('Click to copy');
    }, 2000);
  };

  return (
    <div className="app-container">
      <div className="title">
        <div style={{ display: 'inline-block' }} className="logo">
          <div style={{ display: 'flex' }}>
            <div style={{ height: '10px', width: '10px', backgroundColor: '#063940' }} />
            <div style={{ height: '10px', width: '10px', backgroundColor: '#195E63' }} />
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ height: '10px', width: '10px', backgroundColor: '#3E838C' }} />
            <div style={{ height: '10px', width: '10px', backgroundColor: '#8EBDB6' }} />
          </div>
        </div>
        <span style={{ marginLeft: '12px' }}>MAIL-TO</span>
      </div>
      <div className="email-header">
        <div style={{ display: 'flex', alignItems: 'center' }} className="email-header-line">
          <input
            type="text"
            style={{ color: recipientError ? '#ff0000b3' : '#000000' }}
            value={recipient}
            onChange={handleEmailInput}
            placeholder="To:"
          />
          <div className="cc-bcc-container">
            <button
              className={`cc-button ${isCcEnabled ? 'cc-button-selected' : ''}`}
              onClick={() => setIsCcEnabled(!isCcEnabled)}
            >
              Cc:
            </button>
            <button
              className={`cc-button ${isBccEnabled ? 'cc-button-selected' : ''}`}
              onClick={() => setIsBccEnabled(!isBccEnabled)}
            >
              Bcc:
            </button>
          </div>
        </div>
        <div style={{ display: isCcEnabled ? '' : 'none' }} className="email-header-line">
          <input 
            type="text" 
            style={{ color: ccError ? '#ff0000b3' : '#000000' }} 
            value={cc} 
            onChange={handleCcInput} 
            placeholder="Cc:"
          />
        </div>
        <div style={{ display: isBccEnabled ? '' : 'none' }} className="email-header-line">
          <input
            type="text"
            style={{ color: bccError ? '#ff0000b3' : '#000000' }}
            value={bcc}
            onChange={handleBccInput}
            placeholder="Bcc:"
          />
        </div>
        <div className="email-header-line">
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject:" />
        </div>
      </div>
      <div className="email-body">
        <label>Body: </label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={bodyText} />
        <span
          className="copy-prompt"
          style={{
            visibility: isSubmitted ? 'visible' : 'hidden',

          }}
        >
          {copyText}
        </span>
        <CopyToClipboard
          style={{ visibility: isSubmitted ? 'visible' : 'hidden', cursor: 'pointer' }}
          text={generatedMailto}
        >
          <span className="copy-input" onClick={() => handleCopy()}>{generatedMailto}</span>
          {/* <input onClick={() => handleCopy()} type="text" defaultValue={generatedMailto} /> */}
        </CopyToClipboard>
        <button className="generate-button" onClick={async () => await handleGenerateClick()}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default EmailForm;
