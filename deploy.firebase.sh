npm run build
rm -r firebase/public/*
cp -ar build/* firebase/public/
cd firebase/
firebase deploy