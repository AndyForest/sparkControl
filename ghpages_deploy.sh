#! /bin/bash
git checkout gh-pages
git merge master
git commit -m 'updates'
git push origin gh-pages
git checkout master
