FROM quay.io/hermit/hermit-ser:latest

RUN git clone https://github.com/A-d-i-t-h-y-a-n/Hermit-commits /root/hermit-commits
WORKDIR /root/hermit-commits/
RUN yarn install --network-concurrency 1
CMD ["node", "index.js"]
