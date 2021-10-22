import Avatar from '@mui/material/Avatar';

import React from 'react'

export default function AvatarProfile({displayName}) {
    function stringToColor(string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */console.log(color);

      
        return color;
      }
    function stringAvatar(nameed) {
        const striing=nameed.toString();
    
    
        return    {  bgcolor: stringToColor(striing)}
    ;
      }

    return (
        <div className="avatarProfile">
          <Avatar className="userAvatar" sx={stringAvatar(displayName)}>
              {displayName.match(/\b(\w)/g).join('')}
          </Avatar>
        </div>
    )
}
