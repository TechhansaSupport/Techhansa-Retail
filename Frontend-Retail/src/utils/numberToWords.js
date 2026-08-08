export const numberToWords = (num) => {
  if (num === 0) return 'Zero';

  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + 'Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += a[n];
    }
    return str;
  };

  let word = '';
  // Handle Crores
  if (Math.floor(num / 10000000) > 0) {
    word += inWords(Math.floor(num / 10000000)) + 'Crore ';
    num %= 10000000;
  }
  // Handle Lakhs
  if (Math.floor(num / 100000) > 0) {
    word += inWords(Math.floor(num / 100000)) + 'Lakh ';
    num %= 100000;
  }
  // Handle Thousands
  if (Math.floor(num / 1000) > 0) {
    word += inWords(Math.floor(num / 1000)) + 'Thousand ';
    num %= 1000;
  }
  // Handle Hundreds and units
  if (num > 0) {
    word += inWords(num);
  }

  return word.trim();
};
