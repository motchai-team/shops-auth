FROM rust:alpine3.18 AS builder

WORKDIR /src
COPY . .

RUN apk add libpq-dev postgresql-dev musl-dev
RUN cargo build --release

FROM alpine:3.18
COPY --from=builder /src/target/release/web /web
CMD [ "/web" ]
