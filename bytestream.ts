class ByteStream {

    buffer : number[] = []
    offset = 0
    bitoffset = 0  


  constructor() {
    this.buffer = []
    this.offset = 0
    this.bitoffset = 0  
  }
  
  print_bin() {
    const binaryString = Array.from(this.buffer)
      .map(b => `0b${b.toString(2).padStart(8, '0')}`)
      .join(' ');
    console.log(binaryString)
  }

  print_hexa() {
    const binaryString = Array.from(this.buffer)
      .map(b => `0x${b.toString(16).padStart(2, '0')}`)
      .join(' ');
    console.log(binaryString)
  }
  
  reset(val1?: number, val2?: number) {
    this.offset = (val1 === undefined ? 0 : val1)
    this.bitoffset = (val2 === undefined ? 0 : val2)
  }
  
  readBool() {
    const val = (this.buffer[this.offset] >> this.bitoffset) & 1;
    this.bitoffset = (this.bitoffset + 1) & 7;
    if (this.bitoffset === 0) this.offset++;
    return val !== 0;
  }
  
  writeBool(value: boolean) {
    if (this.bitoffset == 0) { 
        this.buffer.push(0);  
        this.offset++;
    }
    if (value) {
        this.buffer[this.offset - 1] |= 1 << (this.bitoffset & 7);
    }
    this.bitoffset = (this.bitoffset + 1) & 7;
  }
  
  readInt() {
    this.bitoffset = 0;
    let nb = 
        (this.buffer[this.offset] << 24) |
        (this.buffer[this.offset + 1] << 16) |
        (this.buffer[this.offset + 2] << 8) |
        this.buffer[this.offset + 3];
    this.offset += 4;
    return nb;
  }
  
  writeInt(value : number) {
    this.bitoffset = 0
    this.buffer.push((value >> 24) & 0xFF);
    this.buffer.push((value >> 16) & 0xFF);
    this.buffer.push((value >> 8) & 0xFF);
    this.buffer.push(value & 0xFF);  
    this.offset += 4;
  }
    
  writeString(str : string) {
    const len : number = str.length;
    this.writeInt(len);
    for (let i = 0; i < len; i++)
        this.buffer.push(str.charCodeAt(i))
    this.offset += len;
  }

  readString() {
    const len = this.readInt();
    let str : string = '';
    for (let i = 0; i < len; i++)
      str += String.fromCharCode(this.buffer[this.offset++])
    return str
  }

  readU32() {
    let i32 = this.readInt();
    return i32 >>> 0
  }
}

let bs = new ByteStream()

bs.writeBool(true)
bs.writeBool(true)
bs.writeBool(true)
bs.writeBool(true)
console.log(bs.readBool())
console.log(bs.readBool())
console.log(bs.readBool())
console.log(bs.readBool())
bs.writeInt(305419896)
bs.reset(1)
console.log(bs.readInt())
