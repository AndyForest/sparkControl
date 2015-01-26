#! /bin/bash
git add .
git commit -m 'resolving cross domain error'
git push -u origin master

git checkout gh-pages
git merge master
git push origin gh-pages
git checkout master
