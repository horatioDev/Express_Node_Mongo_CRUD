function getContactsDBString(password) {
  const databaseStr = `mongodb+srv://contacts:${password}@contacts-cluster.xsvvs0g.mongodb.net/?retryWrites=true&w=majority`;;
  return databaseStr
};

function getPostsDBString(password) {
  const databaseStr = `mongodb+srv://posts:${password}@posts-cluster.suvwexw.mongodb.net/?retryWrites=true&w=majority`;
  return databaseStr
};

function getQuotesDBString(password) {
  const databaseStr = `mongodb+srv://quotes:${password}@quotes-cluster.2cczmmj.mongodb.net/?retryWrites=true&w=majority`;
  return databaseStr
};

function getTasksDBString(password) {
  const databaseStr = `mongodb+srv://tasks:${password}@tasks-cluster.fnjlht6.mongodb.net/?retryWrites=true&w=majority`;
  return databaseStr
};

function getEmployeesDBString(password) {
  const databaseStr = `mongodb+srv://employees:${password}@employees-cluster.lex1ez3.mongodb.net/?retryWrites=true&w=majority`;
  return databaseStr
};

module.exports = { 
  getContactsDBString, 
  getPostsDBString, 
  getQuotesDBString, 
  getTasksDBString,
  getEmployeesDBString
}