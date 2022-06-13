export function categorizeByDate(arr) {
  const categories = arr.reverse().reduce((acc, item) => {
    const date = new Date(item.time);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const older = new Date(today);
    older.setDate(today.getDate() - 7);
    const category =
      date.getTime() > today.getTime()
        ? `Today - ${date.toDateString()}`
        : date.getTime() > yesterday.getTime()
        ? `Yesterday - ${date.toDateString()}`
        : date.getTime() > older.getTime()
        ? `Last 7 days`
        : `Older`;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  let sortedCategories = {};
  //put key  contains today first
  //put key  contains yesterday second
  //put key  contains last 7 days third
  //put key  contains older last
  
  return categories;
}
