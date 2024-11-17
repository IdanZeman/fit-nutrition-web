import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { gapi } from 'gapi-script';

const GoogleCalendarSync = () => {
  const history = useHistory();
  
  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({
        client_id: '343844114401-jeib4l5iajupdu4jf12upqu3g9f7t0fv.apps.googleusercontent.com', // Your Google OAuth Client ID
      });
    });
  }, []);
  
  const handleAuthClick = () => {
    const GoogleAuth = gapi.auth2.getAuthInstance();
    GoogleAuth.signIn().then(() => {
      fetchCalendarEvents();
    });
  };

  const fetchCalendarEvents = () => {
    const GoogleAuth = gapi.auth2.getAuthInstance();
    const accessToken = GoogleAuth.currentUser.get().getAuthResponse().access_token;

    gapi.client.setApiKey('YOUR_GOOGLE_API_KEY');
    gapi.client.load('calendar', 'v3', () => {
      const request = gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(), // Get upcoming events
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });

      request.execute((response) => {
        console.log('Google Calendar events:', response.items);
        // You can store these events in state and render them on the React calendar
      });
    });
  };

  return (
    <div>
      <button onClick={handleAuthClick}>Sign In with Google</button>
    </div>
  );
};

export default GoogleCalendarSync;
