export const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export const getAvatarUrl = (firstName, lastName, email) => {
  const colors = [
    '1a237e', // Deep Blue
    '0d47a1', // Blue
    '006064', // Cyan
    '004d40', // Teal
    '1b5e20', // Green
    '33691e', // Light Green
  ];

  // Use hashCode to get a consistent color for each employee
  const colorIndex = hashCode(email) % colors.length;
  const backgroundColor = colors[colorIndex];

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=${backgroundColor}&color=ffffff&bold=true&format=svg&size=150`;
}
