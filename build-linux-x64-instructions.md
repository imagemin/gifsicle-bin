# how to build gifsicle for x64 Linux

Start an **amazon linux 64 bit x86 ec2 AMI**  (x86 64 bit is super important, that ensures we're on the same platform that lambda runs on.)

login to the ec2 instance and run this:

```bash
sudo yum update
sudo yum install autoconf intltool
sudo yum groupinstall "Development Tools"

wget https://github.com/kohler/gifsicle/archive/v1.93.tar.gz

tar -xzf v1.93.tar.gz
cd gifsicle-1.93

autoreconf -i
./configure --disable-gifview
make
```

then logout and run:

```bash
scp -i sp-tmp.pem ec2-user@18.233.161.219:/home/ec2-user/gifsicle-1.93/src/gifsicle /Users/username/gifsicle/vendor/linux/64/gifsicle
```

These instructions assume your ec2 instance is running at `18.233.161.219`.
