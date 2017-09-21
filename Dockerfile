FROM multiarch/crossbuild as build-linux
WORKDIR /workdir/src
RUN curl https://www.lcdf.org/gifsicle/gifsicle-1.90.tar.gz | tar xz --strip=1
RUN crossbuild autoreconf -ivf
RUN crossbuild ./configure --disable-gifview --disable-gifdiff --prefix="/workdir/bin" --bindir="/workdir/bin"
RUN crossbuild make install

FROM multiarch/crossbuild as build-macos
ENV CROSS_TRIPLE=x86_64-apple-darwin
WORKDIR /workdir/src
RUN curl https://www.lcdf.org/gifsicle/gifsicle-1.90.tar.gz | tar xz --strip=1
RUN crossbuild autoreconf -ivf
RUN crossbuild ./configure --host="x86_64-apple-darwin" --disable-gifview --disable-gifdiff --prefix="/workdir/bin" --bindir="/workdir/bin"
RUN crossbuild make install

FROM multiarch/crossbuild as build-win
ENV CROSS_TRIPLE=x86_64-w64-mingw32
WORKDIR /workdir/src
RUN curl https://www.lcdf.org/gifsicle/gifsicle-1.90.tar.gz | tar xz --strip=1
RUN crossbuild autoreconf -ivf
RUN crossbuild ./configure --host="x86_64-w64-mingw32" --disable-gifview --disable-gifdiff --prefix="/workdir/bin" --bindir="/workdir/bin"
RUN crossbuild make install

FROM alpine
WORKDIR /workdir
COPY --from=build-macos /workdir/bin/gifsicle macos/gifsicle
COPY --from=build-linux /workdir/bin/gifsicle linux/gifsicle
COPY --from=build-win /workdir/bin/gifsicle.exe win/gifsicle.exe
