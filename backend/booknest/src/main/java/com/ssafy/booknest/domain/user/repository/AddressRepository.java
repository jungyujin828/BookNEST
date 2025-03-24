package com.ssafy.booknest.domain.user.repository;

import com.ssafy.booknest.domain.user.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {

}
