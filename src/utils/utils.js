export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // oy 0 dan boshlanadi, shuning uchun +1 qo'shish kerak
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function formatDateM(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0"); // Kun
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Oy
  const year = d.getFullYear(); // Yil
  const hour = String(d.getHours()).padStart(2, "0"); // Soat
  const minute = String(d.getMinutes()).padStart(2, "0"); // Daqiqalar

  return `${day}.${month}.${year} ${hour}:${minute}`;
}
