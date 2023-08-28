const redirectTo = (navigate: any, e: any, url: string) => {
    if(e && e.originalEvent && typeof e.originalEvent.preventDefault === 'function') {
      e.originalEvent.preventDefault();
    } else if(e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    navigate(url);
  }

  export default redirectTo;