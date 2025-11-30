import { Link } from 'react-router-dom'; 
import styles from './styles';

const NotFound = () => {
 

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found 🚫</h1>
      <p style={styles.message}>The page you requested could not be found. It may have been moved or deleted.</p>
      
      <Link 
        to="/" 
        style={styles.link}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = styles.link.backgroundColor || 'transparent';
          e.currentTarget.style.color = styles.link.color;
        }}
      >
        🏡 Return Home
      </Link>
    </div>
  );
};

export default NotFound;