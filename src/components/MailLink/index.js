import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../../firebase.js';

function MailLink({ match }) {
  const history = useHistory();

  useEffect(() => {
    const docRef = db.collection('links').doc(match.params.id);
    docRef.get().then((doc) => {
      if (doc.exists) {
        const { mailto } = doc.data();
        window.location =  mailto;
      } else {
        history.push('/');
      }
    });
  }, [history, match.params.id]);

  return null;
}

export default MailLink;
