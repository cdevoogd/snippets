import { Base64 } from "js-base64"

export class InvalidTokenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InvalidTokenError"
  }
}

export class JWT {
  header: object
  payload: object
  signature: Uint8Array

  constructor(token: string) {
    const sections = token.split(".")
    if (sections.length != 3) {
      throw new InvalidTokenError("Token does not contain 3 sections")
    }

    const encodedHeader = sections[0]
    const encodedPayload = sections[1]
    const encodedSignature = sections[2]

    if (!Base64.isValid(encodedHeader)) {
      throw new InvalidTokenError("Header is not valid base64")
    }
    try {
      this.header = JSON.parse(Base64.decode(encodedHeader))
    } catch (e) {
      throw new InvalidTokenError("Header is not a valid JSON object")
    }

    if (!Base64.isValid(encodedPayload)) {
      throw new InvalidTokenError("Payload is not valid base64")
    }
    try {
      this.payload = JSON.parse(Base64.decode(encodedPayload))
    } catch (e) {
      throw new InvalidTokenError("Payload is not a valid JSON object")
    }

    try {
      this.signature = Base64.toUint8Array(encodedSignature)
    } catch (e) {
      throw new InvalidTokenError("Signature is not valid base64")
    }
  }

  toString(): string {
    const sections = [
      Base64.encodeURL(JSON.stringify(this.header)),
      Base64.encodeURL(JSON.stringify(this.payload)),
      Base64.fromUint8Array(this.signature, true),
    ]
    return sections.join(".")
  }
}
