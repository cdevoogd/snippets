#include <array>
#include <iostream>

/*
Given a byte array and a length, this populates the first 4 bytes of the byte array with the
given length. Array must be pointer to a byte array with a length of at least 4. This function
only handles lengths <= 4 bytes.

239841928 = 00001110 01001011 10110010 10001000

array[0] = (length >> 24) & 0xFF;
    00001110 Shifting right by 24 bits leaves the last 8 bits (byte)
    11111111 AND operation with 0xff
    00001110 is the result that's stored in index 0

array[1] = (length >> 16) & 0xFF;
    00001110 01001011 Shifting right by 16 bits leaves the 16 most significant bits
    00000000 11111111 AND operation with 0xff keeps the least significant byte
             01001011 is the result that's stored in index 1

array[2] = (length >> 8) & 0xFF;
    00001110 01001011 10110010 Shifting right by 8 bits leaves the 24 most significant bits
    00000000 00000000 11111111 AND operation with 0xff keeps the least significant byte
                      10110010 is the result that's stored in index 2

array[3] = length & 0xFF;
    00001110 01001011 10110010 10001000 No shift, we have all bits
    00000000 00000000 00000000 11111111 AND operation with 0xff keeps the least significant byte
                               10001000 is the result that's stored in index 3

Final result:
    array[0] = 00001110
    array[1] = 01001011
    array[2] = 10110010
    array[3] = 10001000
*/
void construct_byte_array(unsigned char* array, const size_t length) {
    array[0] = (length >> 24) & 0xFF;
    array[1] = (length >> 16) & 0xFF;
    array[2] = (length >> 8) & 0xFF;
    array[3] = length & 0xFF;
}

/*
Given a byte array, this will read the first 4 bytes and convert it to an integer equal to the
length of the message.

array[0] = 00001110
array[1] = 01001011
array[2] = 10110010
array[3] = 10001000

length = 00000000 00000000 00000000 00000000
    00000000 00000000 00000000 00000000 Shift 8 bits left (which does nothing since it's 0)
    00000000 00000000 00000000 00001110 OR with array[0]
    00000000 00000000 00000000 00001110 length is now this

length = 00000000 00000000 00000000 00001110
    00000000 00000000 00001110 00000000 Shift 8 bits left
    00000000 00000000 00000000 01001011 OR with array[1]
    00000000 00000000 00001110 01001011 length is now this

length = 00000000 00000000 00001110 01001011
    00000000 00001110 01001011 00000000 Shift 8 bits left
    00000000 00000000 00000000 10110010 OR with array[2]
    00000000 00001110 01001011 10110010 length is now this

length = 00000000 00001110 01001011 10110010
    00001110 01001011 10110010 00000000 Shift 8 bits left
    00000000 00000000 00000000 10001000 OR with array[3]
    00001110 01001011 10110010 10001000 length is now this

00001110 01001011 10110010 10001000 = 239841928
length is 239841928
*/
size_t parse_byte_array(unsigned char* array) {
    int length = 0;
    for (int i = 0; i < 4; i++) {
        length <<= 8;
        length |= array[i];
    }
    return length;
}

void print_binary(const int num) {
    std::cout << std::bitset<32>(num) << " (" << num << ")" << std::endl;
}

template <typename T>
void print_byte_array(T bytes) {
    for (int byte : bytes) {
        std::cout << std::bitset<8>(byte) << " ";
    }
    printf("\n");
}

int main() {
    int length = 239841928;
    print_binary(length);

    std::array<unsigned char, 4> array;
    construct_byte_array(array.data(), length);
    print_byte_array(array);

    size_t parsed_length = parse_byte_array(array.data());
    print_binary(parsed_length);

    return 0;
}