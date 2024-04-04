import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Session = ({ programId }) => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    fetch(`https://pretty-prosperity-17e0b1a4eb.strapiapp.com/api/sessions?populate=*&filters[program][id][$eq]=${programId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setSessions(data.data);
    })
    .catch(error => console.error('Error fetching sessions:', error));
  }, [programId]);

  // 这里可以添加更多的解析函数，例如解析objectives等
  const handleSessionClick = (sessionId, programTitle, sessionTitle) => {
    navigate(`/programs/${programId}/sessions/${sessionId}`,{ 
      state: { 
        programId: programId, 
        programTitle: programTitle,
        sessionTitle: sessionTitle,
        }
      });
    };

    return (
      <div>
        {sessions && sessions.length > 0 ? (
          sessions.map(session => (
            <div
              key={session.id}
              className="mb-2 p-4 transition duration-300 ease-in-out hover:shadow-lg hover:border-transparent border-b border-gray-200"
            >
              <li className="px-6 py-0 flex justify-between items-center">
                <div className="w-1/3 text-sm font-medium text-blue-500" onClick={() => handleSessionClick(session.id, session.attributes.program.data.attributes.Title, session.attributes.Title)}>{session.attributes.Title}</div>
                <div className="w-1/3 text-sm font-medium text-gray-500 text-center">{session.attributes.Duration}</div>
                <div className="w-1/3 text-sm font-medium text-gray-500 text-center">
                  {session.attributes.Tags ? (
                    session.attributes.Tags.split(',').map((tag, index) => (
                      <span key={index} >
                        {tag.trim()}
                      </span>
                    ))
                  ) : (
                    <span>No tags</span>
                  )}
                </div>
              </li>
            </div>
          ))
        ) : (
          <p>No sessions available.</p>
        )}
      </div>
    );    
};
