import neo4j from 'neo4j-driver';
import 'dotenv/config';

let driver;

try {
  driver = neo4j.driver(
    process.env.COGNODB_URI,
    neo4j.auth.basic(process.env.COGNODB_USERNAME, process.env.COGNODB_PASSWORD)
  );
} catch (error) {
  console.error('Failed to initialize neo4j driver', error);
}

const getSession = () => {
  return driver.session();
};

const verifyConnection = async () => {
  try {
    await driver.getServerInfo();
    console.log('Connected to CognoDB');
    return true;
  } catch (error) {
    console.error('CognoDB connection error', error);
    return false;
  }
};

const closeDriver = async () => {
  if (driver) {
    await driver.close();
  }
};

process.on('SIGINT', async () => {
  await closeDriver();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await closeDriver();
  process.exit(0);
});

export { driver, getSession, verifyConnection, closeDriver };
