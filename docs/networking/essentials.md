# Essentials

Everything you need to know to have a basic understanding of networking

## Binary-Decimal Conversions

Binary is a number system with a base 2 meaning, it can have only 2 digits starting from 0, meaning 0 and 1.

### Binary Table

| 128  | 64   | 32   | 16   | 8    | 4    | 2    | 1    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |

We simply add the number if the value is 1 and ignore it if the value is 0.

An IPv4 address is made up of 4 such octets.

### IPv4 to Binary

An example of a decimal to binary conversion can be converting this IPv4 address to binary digits. 192.168.1.1

| 192             | 168             | 1               | 1               |
| --------------- | --------------- | --------------- | --------------- |
| 1 1 0 0 0 0 0 0 | 1 0 1 0 1 0 0 0 | 0 0 0 0 0 0 0 1 | 0 0 0 0 0 0 0 1 |

Mathematically, it is just as simple as adding all possible values to arrive at the decimal.

$$ 192 = (128*1) + (64*1) + (32*0) + (16*0) + (8*0) + (4*0) + (2*0) + (1*0) $$

|      | 128  | 64   | 32   | 16   | 8    | 4    | 2    | 1    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 192  | 1    | 1    | 0    | 0    | 0    | 0    | 0    | 0    |
| 168  | 1    | 0    | 1    | 0    | 1    | 0    | 0    | 0    |
| 1    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 1    |
| 5    | 0    | 0    | 0    | 0    | 0    | 1    | 0    | 1    |

Because these are 4 octets with a maximum value of 128, the highest number in an IP address can be 255 (meaning all 1s)

|      | 128  | 64   | 32   | 16   | 8    | 4    | 2    | 1    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 255  | 1    | 1    | 1    | 1    | 1    | 1    | 1    | 1    |

### IPv6 to Binary

IPv6 uses a 128-bit addressing system with 340 undecillion possible numbers. Here we use the hexadecimal Base-16 system.

| 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | A    | B    | C    | D    | E    | F    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   | 11   | 12   | 13   | 14   | 15   |

The hexadecimal 4 binary bits perfection table

| Decimal     | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   | 11   | 12   | 13   | 14   | 15   |
| ----------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Hexadecimal | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | A    | B    | C    | D    | E    | F    |
| Binary      | 0000 | 0001 | 0010 | 0011 | 0100 | 0101 | 0110 | 0111 | 1000 | 1001 | 1010 | 1011 | 1100 | 1101 | 1110 | 1111 |

This table should be read in conjunction with the binary table up to 8. The hexadecimal system thus gives a perfect permutation and combination of up to 4 binary digits.

$$ 16 = (1*8) + (1*4) + (1*2) + (1*1) $$

Example of an IPv6 address to binary conversion

Hexadecimal (32-bit) → 2001:0db8:cafe:0001:0000:0000:0000:0100

Binary (128-bit) → 0010000000000001:0000110110111000:1100101011111110:0000000000000001:0000000000000000:0000000000000000:0000000000000000:0000000100000000