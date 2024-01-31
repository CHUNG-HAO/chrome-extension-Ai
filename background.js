chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    let {question, options} = request;
  
    fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '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'
      },
      body: JSON.stringify({
        prompt: `${question}\n${options.join('\n')}`,
        max_tokens: 60
      })
    })
    .then(response => response.json())
    .then(data => {
      let answer = data.choices[0].text.trim();

      let similarities = options.map(option => similarity(answer, option));
  
      let bestMatchIndex = similarities.indexOf(Math.max(...similarities));
  
      sendResponse({answer: options[bestMatchIndex]});
      console.log("check");
    });
  
    return true;  
  });
  
 
  function similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    console.log("checkb");
  }
  

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    let costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
    
  }