<?php

namespace App\DataFixtures;

use App\Entity\Book;
use App\Entity\Loan;
use App\Entity\Role;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixture extends Fixture
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $hash;

    public function __construct(UserPasswordEncoderInterface $encoder){
        $this->hash = $encoder;
    }
    public function load(ObjectManager $manager)
    {
        $admin=new User();
        $admin->setName("admin");
        $admin->setEmail("admin@library.com");
        $admin->setPassword($this->hash->encodePassword($admin,'admin123'));
        $admin->setAddress("Al alia bizerte");
        $admin->setPhone(54808062);
        $admin->setEmailStatus(1);
        $admin->setRoles(array('ROLE_ADMIN'));
        $manager->persist($admin);
        $user=new User();
        $user->setName("home");
        $user->setEmail("home@library.com");
        $user->setPassword($this->hash->encodePassword($user,'user123'));
        $user->setAddress("Al alia bizerte");
        $user->setPhone(54808062);
        $manager->persist($user);
        $book=new Book();
        $book->setReference("HKKD255MLDNC5854");
        $book->setTitle("DEV WEB");
        $book->setCategory("COMPUTER SCIENCE");
        $book->setAuthor("NASR EDDINE");
        $manager->persist($book);
        $loan=new Loan();
        $loan->setBook($book);
        $loan->setUser($user);
        $loan->setTakenAt(new \DateTime());
        $manager->persist($loan);
        $manager->flush();
    }
}
