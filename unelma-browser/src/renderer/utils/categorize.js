export function categorizeByDate(arr) {
  const categories = arr.reverse().reduce((acc, item) => {
    const date = new Date(item.time);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const older = new Date(today);
    older.setDate(today.getDate() - 7);
    let category;
    if (date.getTime() > today.getTime()) {
      category = `Today - ${date.toDateString()}`;
    } else if (date.getTime() > yesterday.getTime()) {
      category = `Yesterday - ${date.toDateString()}`;
    } else if (date.getTime() > older.getTime()) {
      category = `Last Week`;
    } else {
      category = `Older`;
    }
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
  return categories;
}
