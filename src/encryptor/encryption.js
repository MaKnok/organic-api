import SimpleEncryptor from 'simple-encryptor';

const encryptor = SimpleEncryptor('123456789jkkdkfkf');

export const encrypt = (data) => encryptor.encrypt(data);
export const decrypt = (data) => encryptor.decrypt(data);