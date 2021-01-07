<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    // /**
    //  * @return home[] Returns an array of home objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?home
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
    public function findUsersByRole(string $role):?array
    {
     return $this->createQueryBuilder('user')
            ->andWhere("user.roles LIKE :role")
            ->setParameter('role','%'.$role.'%')
            ->getQuery()
            ->getResult();

    }
    public function mostFiveStudents():?array
    {
        return $this->createQueryBuilder('user')
                ->select('user,count(user.id) as loans')
                ->andWhere("user.roles LIKE :role")
                ->setParameter('role','%ROLE_STUDENT%')
                ->leftJoin('user.loans','loan')
                ->groupBy('user.id')
                ->orderBy('loans','DESC')
                ->setMaxResults(5)
                ->getQuery()
                ->getResult();
    }
    public function findLateComers():?array
    {
        return $this->createQueryBuilder('user')
            ->innerJoin('user.loans','loan')
            ->andWhere('loan.returnedAt is null')
            ->andWhere('DATE_DIFF(CURRENT_TIMESTAMP(),loan.takenAt)>10')
            ->getQuery()
            ->getResult();
    }
    public function checkLoansNotReturned(User $user):?array
    {
        return $this->createQueryBuilder('user')
            ->innerJoin('user.loans','loan')
            ->andWhere('loan.returnedAt is null')
            //->andWhere('DATE_DIFF(CURRENT_TIMESTAMP(),loan.takenAt)>10')
            ->andWhere('loan.user =:val')
            ->setParameter('val', $user)
            ->getQuery()
            ->getResult();
    }
}
