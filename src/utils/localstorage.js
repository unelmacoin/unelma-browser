export const setLocalStorage = (name, items) => {
    localStorage.setItem(name, JSON.stringify(items));
}
export const getLocalStorage = (name) => {
    const data = JSON.parse(localStorage.getItem(name));
    if (Object.values(data).length > 0) {
        if (parseInt(data.initLoad) === 1) {
            localStorage.setItem(name, JSON.stringify({
                "initLoad":"2",
                "dialIsOpen":"true",
            }));
            
            return {
                "initLoad":"1",
                "dialIsOpen":false,
            };
        } 
        else
        {
            return {
                    "initLoad":"2",
                    "dialIsOpen":true,
                };
            
            }
    }
    
    else {
        localStorage.setItem(name, JSON.stringify({
            "initLoad":"3",
            "dialIsOpen":true,
        }));
        return {
            "initLoad":"3",
            "dialIsOpen":true,
        };
    }
}

export const refreshPage = () =>{
    window.location.reload();
}