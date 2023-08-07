import React, { useState } from 'react';
import './siteData.css'

const SiteData = () => {

    const [selectedOptions, setSelectedOptions] = useState([]);
  const [duration, setDuration] = useState('');

  const handleOptionChange = (e) => {
    const optionValue = e.target.value;
    const isChecked = e.target.checked;
alert(optionValue)
    if (isChecked) {
      setSelectedOptions([...selectedOptions, optionValue]);
    } else {
      setSelectedOptions(selectedOptions.filter((option) => option !== optionValue));
    }
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleDelete = () => {
  
    alert('Selected Options:', selectedOptions);
    console.log('Duration:', duration);
    
  };
    return (
        <div className='container'>
        <h2>Clear Browser Data</h2>
        <div className='options'>
          <label>
            <input type="checkbox" value="cookies" onChange={handleOptionChange} />
            Cookies
          </label>
          <br />
          <label>
            <input type="checkbox" value="cache" onChange={handleOptionChange} />
            Cache
          </label>
          <br />
          <label>
            <input type="checkbox" value="history" onChange={handleOptionChange} />
            History
          </label>
        </div>
        <br />
        <div className='duration'>
          <label>
            Duration (in days):
            <input type="number" value={duration} onChange={handleDurationChange} />
          </label>
        </div>
        <br />
        <button className='deleteButton' onClick={handleDelete}>Delete</button>
      </div>
    );
};

export default SiteData;