export const formatCNPJandCPF = (value: string) => {
  let cleaned = value.replace(/[^0-9]/g, '');

  if (cleaned.length <= 11) {
      cleaned = cleaned.slice(0, 11);
      return cleaned.replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
      cleaned = cleaned.slice(0, 14);
      return cleaned.replace(/(\d{2})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1/$2")
                    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
};

  export const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = '';
  
    if (cleaned.length > 0) {
      formatted = `(${cleaned.substring(0, 2)}`;
    }
    if (cleaned.length > 2) {
      formatted += `)${cleaned.substring(2, 7)}`;
    }
    if (cleaned.length > 7) {
      formatted += `-${cleaned.substring(7, 11)}`;
    }
  
    return formatted;
  };

  export const formatCEPNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 8);

    let formatted = cleaned;
    if (cleaned.length > 5) {
        formatted = `${cleaned.substring(0, 5)}-${cleaned.substring(5)}`;
    }

    return formatted;
};