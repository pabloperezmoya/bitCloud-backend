export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secretKey',
};

export enum DefaultFolders {
  ROOT = 'root',
  SHARED = 'shared',
}
