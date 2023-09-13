
const calculatePrice = (prevPoints: number) => {
    const psRatio = 0.00816;
    //round to the nearest number, but will always at least be 1
    const price = Math.max(1, Math.round(prevPoints * psRatio));
    return price;
  };

  export default calculatePrice