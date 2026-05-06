// src/hooks/useFooterEmail.js - With caching
import { useState, useEffect } from 'react';
import { footerService } from '../services/api';

// Simple cache outside hook
let cachedEmail = null;

export const useFooterEmail = () => {
  const [email, setEmail] = useState(cachedEmail || '');
  const [loading, setLoading] = useState(!cachedEmail);

  useEffect(() => {
    // If we already have cached email, don't fetch again
    if (cachedEmail) {
      setLoading(false);
      return;
    }

    const fetchEmail = async () => {
      try {
        setLoading(true);
        const response = await footerService.getFooterConfig();
        
        if (response.success && response.data) {
          const fetchedEmail = response.data.email || '';
          cachedEmail = fetchedEmail; // Cache the result
          setEmail(fetchedEmail);
        } else {
          setEmail('');
        }
      } catch (error) {
        console.error('Error fetching footer email:', error);
        setEmail('');
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, []);

  return { email, loading };
};