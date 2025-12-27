import crypto from 'crypto';

export const calculateChecksum = (content: string): string => {
	return crypto.createHash('md5').update(content).digest('hex');
};
